class Version < ApplicationRecord
  include Authoring
  include PgSearch
  include Regexes

  enum version_type: %i[original translation interpretation alternative]

  acts_as_list scope: :song
  belongs_to :song
  belongs_to :user
  has_many :version_authors, dependent: :destroy
  has_many :setlist_versions, dependent: :nullify

  validates_presence_of :title, :content
  validates_format_of :key, with: /\A[A-G][b#]?m?\z/, allow_blank: true

  before_validation :check_create_song, on: :create
  before_validation :set_lyrics
  before_validation :set_authors
  after_destroy :clean_up_song

  scope :ordered, -> { order(:position) }
  scope :newest_first, -> { order(created_at: :desc) }
  scope :oldest_first, -> { order(:created_at) }
  scope :alphabetical, -> { order(:title) }

  scope :find_by_slug_and_position, ->(slug, position) {
    joins(:song).where(songs: { slug: slug }).find_by(position: position)
  }

  pg_search_scope :search_for,
                  against: %i(title author_name lyrics),
                  ignoring: :accents

  def check_create_song
    self.song = Song.create title: title if song_id.blank?
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

  def set_authors
    self.author_name = [artist_names, composer_names, lyricist_names].map{|name|
      name.to_s.gsub(/\s+/, ' ').strip.presence
    }.compact.join(', ')
  end

  def transpose
    0
  end
end
