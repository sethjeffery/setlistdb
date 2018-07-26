class SetlistVersionAuthor < ApplicationRecord
  belongs_to :setlist_version
  belongs_to :author

  acts_as_list

  enum authoring: [:artist, :composer, :lyricist]
  scope :ordered, -> { order(:position) }

end
