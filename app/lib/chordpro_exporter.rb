require 'exporter'

class ChordproExporter < Exporter
  def to_s
    file = []
    file << "{title: #{version.title}}"
    file << "{artist: #{version.artist_names}}" if version.artists.present?
    file << "{composer: #{version.composer_names}}" if version.composers.present?
    file << "{lyricist: #{version.lyricist_names}}" if version.lyricists.present?
    file << "{key: #{version.key}}" if version.key?
    file << "{year: #{version.year}}" if version.year?
    file << ""

    self.sections.each do |section|
      lines = section.split(/\r?\n/)

      if lines[0].match? TITLE_REGEX
        title = lines[0].sub(/^[\s:]/, '').sub(/[\s:]$/, '')
        if title == 'CHORUS'
          file << "{soc}"
          file << lines[1..lines.length].join("\r\n")
          file << "{eoc}"
        else
          file << "{start_of_verse: #{title}}"
          file << lines[1..lines.length].join("\r\n")
          file << "{end_of_verse}"
        end
      else
        file << section
      end

      file << ''
    end

    file.join("\r\n")
  end
end
