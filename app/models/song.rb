class Song < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  has_one :first_version, -> { ordered }, class_name: 'Version'
  has_many :versions, -> { ordered }, dependent: :destroy

  validates_presence_of :title

  def to_s
    title
  end
end
