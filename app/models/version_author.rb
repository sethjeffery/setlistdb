class VersionAuthor < ApplicationRecord
  belongs_to :version
  belongs_to :author
  acts_as_list

  enum authoring: [:artist, :composer, :lyricist]
  scope :ordered, -> { order(:position) }
end
