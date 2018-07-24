class Version < ApplicationRecord
  include Authoring
  include PgSearch
  include Regexes

  acts_as_list scope: :song
  scope :ordered, -> { order(:position) }
  scope :newest_first, -> { order(created_at: :desc) }
  scope :oldest_first, -> { order(:created_at) }
  scope :alphabetical, -> { order(:title) }

  belongs_to :song
  belongs_to :user

  after_destroy :clean_up_song
  enum version_type: %i[original translation interpretation alternative]

  validates_presence_of :title, :content
  validates_format_of :key, with: /\A[A-G][b#]?m?\z/, allow_blank: true

  before_validation :check_create_authors
  before_validation :check_create_song, on: :create
  before_validation :set_lyrics

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

end
