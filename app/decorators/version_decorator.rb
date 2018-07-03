class VersionDecorator < ApplicationDecorator
  delegate_all

  CHORD_REGEX = /\[([\w#+-\/]+)\]/
  TITLE_REGEX = /^:*(?:\d(st|nd|rd|th)\s)?(?:V|VERSE|CHORUS|PRE|PRE-?CHORUS|BRIDGE|CODA|INTRO|OUTRO|TAG)\s*\d*:*$/i

  def chords?
    content =~ CHORD_REGEX
  end

  def to_html
    html = ''.html_safe
    sections = content.to_s.split(/\r?\n(?:\r?\n)+/)

    sections.select(&:present?).each do |section|
      has_chords = CHORD_REGEX.match?(section)
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

        lines.each do |line|
          sanitized = h.sanitize(line).gsub(CHORD_REGEX, '<span class="chord">\1</span>').html_safe
          line = h.content_tag(:div, sanitized, class: 'song-line')
          section_html += line
        end

        section_html

      end
    end

    html
  end
end
