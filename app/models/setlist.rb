class Setlist < ApplicationRecord
  include Hashid::Rails

  # auto-add song to new setlist
  attr_accessor :song, :version

  belongs_to :user
  has_many :setlist_versions, dependent: :destroy
  has_many :versions, through: :setlist_versions

  scope :active, -> { where('date >= ?', Date.current) }
  scope :past, -> { where('date < ?', Date.current) }
  scope :for, -> user { where(user_id: user.id) }
  scope :newest_first, -> { order(date: :desc, created_at: :desc) }
  scope :oldest_first, -> { order(:date, :created_at) }
  validates_presence_of :date
  before_create :add_first_version

  def active?
    date >= Date.current
  end

  def past?
    date < Date.current
  end

  def add_first_version
    add(song, version) if song.present? && version.present?
  end

  def add(slug, version)
    version_id = Version.find_by_slug_and_position(slug, version).id
    if new_record?
      setlist_versions.build(version_id: version_id)
    else
      setlist_versions.create(version_id: version_id)
    end
  end

  def reorder(*hashids)
    hashids.flatten.each_with_index do |hashid, index|
      setlist_versions.detect{|sv| sv.hashid == hashid }&.update_column('position', index + 1)
    end
  end
end
