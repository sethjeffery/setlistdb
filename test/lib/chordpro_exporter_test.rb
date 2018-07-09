require 'test_helper'

class ChordproExporterTest < ActiveSupport::TestCase
  test 'output' do
    exporter = ChordproExporter.new(versions(:write_a_song))
    output = exporter.to_s
    assert output.present?
    assert_includes output, "{title: #{versions(:write_a_song).title}}"
    assert_includes output, "{key: #{versions(:write_a_song).key}}"
    assert_includes output, versions(:write_a_song).content
  end

end
