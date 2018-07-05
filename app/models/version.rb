class Version < ApplicationRecord
  include PgSearch

  acts_as_list scope: :song

  belongs_to :song
  belongs_to :user
  belongs_to :author, optional: true

  after_destroy :clean_up_song
  enum version_type: %i[original translation interpretation alternative]

  validates_presence_of :title, :content

  before_validation :check_create_author
  before_validation :check_create_song, on: :create
  before_validation :set_author_name

  scope :ordered, -> { order(:position) }
  pg_search_scope :search_for,
                  against: %i(title author_name lyrics),
                  ignoring: :accents

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

  def clean_up_song
    song.destroy if song.reload.versions.count.zero?
  end

  def set_author_name
    self.author_name = author&.name
  end
end
