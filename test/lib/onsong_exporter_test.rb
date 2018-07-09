require 'test_helper'

class OnsongExporterTest < ActiveSupport::TestCase
  test 'output' do
    exporter = OnsongExporter.new(versions(:write_a_song))
    output = exporter.to_s
    assert output.present?
    assert_includes output, versions(:write_a_song).title
    assert_includes output, "Key: #{versions(:write_a_song).key}"
    assert_includes output, versions(:write_a_song).content
  end

end
