class ApplicationController < ActionController::Base
  include StoreLocation

  rescue_from CanCan::AccessDenied, with: :auto_login

  def auto_login(exception)
    if user_signed_in?
      raise exception
    else
      redirect_to user_facebook_omniauth_authorize_path
    end
  end
end
