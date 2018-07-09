require 'exporter'

class OnsongExporter < Exporter
  def to_s
    file = []
    file << version.title
    file << version.author_name if version.author_name?
    file << "Key: #{version.key}" if version.key?
    file << "Year: #{version.year}" if version.year?
    file << ""
    file << version.content

    file.join("\r\n")
  end
end
