class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    # You need to implement the method below in your model (e.g. app/models/user.rb)
    @user = User.from_omniauth(request.env["omniauth.auth"])
    sign_in_and_redirect @user, event: :authentication # this will throw if @user is not activated
    set_flash_message(:notice, :success, kind: "Facebook") if is_navigational_format?
  end

  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])
    sign_in_and_redirect @user, event: :authentication # this will throw if @user is not activated
    set_flash_message(:notice, :success, kind: "Google_oauth2") if is_navigational_format?
  end

  def failure
    redirect_to root_path
  end

  def after_sign_in_path_for(resource_or_scope)
    stored_location_for(resource_or_scope) || super
  end
end
