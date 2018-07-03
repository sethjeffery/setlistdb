class Version < ApplicationRecord
  attr_writer :author_name
  acts_as_list scope: :song

  belongs_to :song
  belongs_to :user
  belongs_to :author, optional: true

  enum version_type: %i[original translation interpretation alternative]

  validates_presence_of :title, :content

  before_validation :check_create_author
  before_validation :check_create_song, on: :create

  scope :ordered, -> { order(:position) }

  def check_create_author
    if !author && author_name.is_a?(String) && author_name.strip.present?
      self.author = Author.find_or_create_by(name: author_name.strip)
    end
  end

  def check_create_song
    if song_id.blank?
      self.song = Song.create title: title, author: author
    end
  end

  def to_param
    position.to_s
  end

  def author_name
    @author_name || author&.name
  end
end
