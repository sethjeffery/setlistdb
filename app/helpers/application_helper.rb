module ApplicationHelper
  def site_domain
    Rails.application.config.x.domain
  end

  def site_name
    'Setlist⋅db'
  end
end
