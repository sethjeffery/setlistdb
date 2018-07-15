class Version < ApplicationRecord
  include PgSearch
  include Regexes

  acts_as_list scope: :song

  belongs_to :song
  belongs_to :user
  belongs_to :author, optional: true

  after_destroy :clean_up_song
  enum version_type: %i[original translation interpretation alternative]

  validates_presence_of :title, :content
  validates_format_of :key, with: /\A[A-G][b#]?m?\z/

  before_validation :check_create_author
  before_validation :check_create_song, on: :create
  before_validation :set_lyrics

  scope :ordered, -> { order(:position) }

  scope :find_by_slug_and_position, ->(slug, position) {
    joins(:song).where(songs: { slug: slug }).find_by(position: position)
  }

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

  def set_lyrics
    self.lyrics = content.split(/,?\r?\n/).reject{|line|
      line =~ CHORDSIMPLE_REGEX || line =~ TITLE_REGEX || line.strip.blank?
    }.map{|line|
      line.gsub(CHORDPRO_REGEX, '')
    }.join(", ")
  end
end
