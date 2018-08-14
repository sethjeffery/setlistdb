class SetlistVersion < ApplicationRecord
  include Hashid::Rails
  include Authoring

  belongs_to :setlist
  belongs_to :version, optional: true
  has_many :setlist_version_authors, dependent: :destroy
  has_many :authors, through: :setlist_version_authors

  acts_as_list
  scope :ordered, -> { order(:position) }

  before_validation :inherit_version_fields, on: :create

  def inherit_version_fields
    self.title ||= version.title
    self.content ||= version.content
    self.key ||= version.key
    self.year ||= version.year
    self.lang ||= version.lang
    self.notes ||= version.notes if has_attribute? :notes

    self.artist_names = version.artist_names if artist_names.blank?
    self.composer_names = version.composer_names if composer_names.blank?
    self.lyricist_names = version.lyricist_names if lyricist_names.blank?
  end
end
