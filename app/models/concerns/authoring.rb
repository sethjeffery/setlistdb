module Authoring
  extend ActiveSupport::Concern

  included do

    attr_writer :lyricist_names, :artist_names, :composer_names

    has_many :version_authors, dependent: :destroy
    has_many :version_artists, -> { artist.ordered }, class_name: 'VersionAuthor'
    has_many :version_lyricsts, -> { lyricist.ordered }, class_name: 'VersionAuthor'
    has_many :version_composers, -> { composer.ordered }, class_name: 'VersionAuthor'
    has_many :authors, through: :version_authors
    has_many :artists, through: :version_artists, source: :author
    has_many :lyricists, through: :version_lyricsts, source: :author
    has_many :composers, through: :version_composers, source: :author

    after_save :check_create_authors

  end

  def check_create_authors
    artist_names = self.artist_names.to_s.gsub(/\s+/, ' ').strip.presence
    lyricist_names = self.lyricist_names.to_s.gsub(/\s+/, ' ').strip.presence
    composer_names = self.composer_names.to_s.gsub(/\s+/, ' ').strip.presence
    self.author_name = [artist_names, composer_names, lyricist_names].compact.join(', ')

    version_authors.destroy_all

    artist_names = artist_names.to_s.split(/(?:, ?| & | and )/).uniq.select(&:present?)
    artist_names.each do |name|
      author = Author.find_or_create_by(name: name.strip)
      version_authors.create(author_id: author.id, authoring: VersionAuthor.authorings[:artist])
    end

    lyricist_names = lyricist_names.to_s.split(/(?:, ?| & | and )/).uniq.select(&:present?)
    lyricist_names.each do |name|
      author = Author.find_or_create_by(name: name.strip)
      version_authors.create(author_id: author.id, authoring: VersionAuthor.authorings[:lyricist])
    end

    composer_names = composer_names.to_s.split(/(?:, ?| & | and )/).uniq.select(&:present?)
    composer_names.each do |name|
      author = Author.find_or_create_by(name: name.strip)
      version_authors.create(author_id: author.id, authoring: VersionAuthor.authorings[:composer])
    end
  end

  def artist_names
    @artist_names || artists.map(&:name).join(', ')
  end

  def composer_names
    @composer_names || composers.map(&:name).join(', ')
  end

  def lyricist_names
    @lyricist_names || lyricists.map(&:name).join(', ')
  end

end
