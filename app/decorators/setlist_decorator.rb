class SetlistDecorator < ApplicationDecorator
  delegate_all

  def to_s
    setlist.title.presence || date.strftime('%d %B %Y')
  end
end
