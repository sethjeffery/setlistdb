class Setlist < ApplicationRecord
  belongs_to :user
  has_many :setlist_versions
  has_many :versions, through: :setlist_versions

  scope :active, -> { where('date >= ?', Date.current) }
  scope :past, -> { where('date < ?', Date.current) }
  scope :for, -> user { where(user_id: user.id) }

  validates_presence_of :date

  def active?
    date >= Date.current
  end

  def past?
    date < Date.current
  end
end
