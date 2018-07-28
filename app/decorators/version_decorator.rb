class VersionDecorator < ApplicationDecorator
  include Regexes
  delegate_all

  def chords?
    content =~ CHORD_REGEX
  end

  def to_html
    html = ''.html_safe
    sections = content.to_s.split(/\r?\n(?:\r?\n)+/)

    if notes.present?
      html += h.content_tag(:div, notes, class: 'comment')
    end

    sections.select(&:present?).each do |section|
      has_chords = CHORDPRO_REGEX.match?(section) || CHORDSIMPLE_REGEX.match?(section)
      html += h.content_tag(:div, class: "song-section #{'song-section--chorded' if has_chords}") do

        section_html = ''.html_safe

        lines = section.split(/\r?\n/)
        if TITLE_REGEX.match? lines.first
          title = lines.first
                    .gsub(/:/, '')
                    .gsub(/^c(?:horus)?( ?\d?)$/i, 'Chorus \1')
                    .gsub(/^v(?:erse)?( ?\d?)$/i, 'Verse \1')
                    .gsub(/^b(?:ridge)?( ?\d?)$/i, 'Bridge \1')
                    .titleize

          section_html += h.content_tag(:h3, title, class: 'song-section-title')
          lines = lines[1...lines.length]
        end

        as_chord_pro(lines).each do |line|
          sanitized = h.sanitize(line).gsub(CHORDPRO_REGEX) { |m|
            m = m.match(CHORD_REGEX).to_s
            if version.transpose
              note = m.match(/[A-G][b#]?/).to_s
              new_key = Transposer.transpose_key(key: key, by: transpose)
              new_note = Transposer.transpose(from: key, to: new_key, note: note)
              m.gsub!(note, new_note)
            end
            m.gsub!(/([b#])/, '<sup>\1</sup>')
            %{<span class="chord">#{m}</span>}
          }.html_safe
          line = h.content_tag(:div, sanitized, class: 'song-line')
          section_html += line
        end

        section_html

      end
    end

    html
  end

  private

  def as_chord_pro(lines)
    output = []

    lines.each_with_index do |line, index|
      if index < lines.length - 1 && CHORDSIMPLE_REGEX.match?(line) && index < lines.length && !CHORDSIMPLE_REGEX.match?(lines[index+1])
        offset = 0
        line.scan(CHORD_REGEX) do |match|
          match_index = Regexp.last_match.offset(0)[0]
          before = lines[index+1][0...(match_index + offset)]
          after = lines[index+1][(match_index + offset)...(lines[index+1].length)]
          lines[index+1] = "#{before}[#{match}]#{after}"
          offset += match.length + 2
        end
      else
        output << line
      end
    end

    output
  end
end
