class Exporter
  include Regexes
  attr_reader :version

  def initialize(version)
    @version = version
  end

  def sections
    version.content.split(/(?:\r?\n){2,}/)
  end
end
