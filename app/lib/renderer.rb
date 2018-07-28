module Renderer
  extend self

  def render_key(key)
    key.gsub(/([b#])/, '<sup>\1</sup>').html_safe
  end

end
