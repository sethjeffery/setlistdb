class Importer
  include Regexes
  attr_reader :content, :file

  DIRECTIVE_REGEX = /^\s*{\s*(\w+)(?::\s*(.*))?\s*}\s*$/i
  NAMEVALUE_REGEX = /^\s*(key|artist|lyricist|composer|title|year):\s*(\w)\s*$/i

  def initialize(file)
    @file = file
    if file.is_a?(String)
      @content = file
    elsif file.respond_to?(:read)
      @content = file.read
    elsif file.respond_to?(:path)
      @content = File.read(file.path)
    else
      logger.error "Bad file_data: #{file.class.name}: #{file.inspect}"
    end
  end

  def as_version
    version = Version.new
    version.content = content

    split = content.split(/(?:\r?\n){2,}/)
    header = split[0]
    header_lines = header.split(/\r?\n/)

    unless header_lines[0] =~ CHORDPRO_REGEX || header_lines[0] =~ CHORDSIMPLE_REGEX
      index = 0
      header_lines.each do |line|
        match = line.match(DIRECTIVE_REGEX) || line.match(NAMEVALUE_REGEX)
        if match
          set_from_regex_match(version, match)
        elsif line.present?
          set_from_line_number(version, line, index)
          index += 1
        end
      end

      version.content = split[1..split.length].join("\r\n\r\n")
    end

    version
  end

  def set_from_regex_match(version, match)
    case match[1].downcase
    when 'year'
      version.year = match[2].to_i
    when 'title'
      version.title = match[2]
    when 'artist', 'composer', 'lyricist'
      version.author_name = match[2]
    when 'key'
      version.key = match[2]
    end
  end

  def set_from_line_number(version, line, index)
    if index == 0
      version.title = line.strip
    elsif index == 1
      version.author_name = line.strip
    end
  end
end
