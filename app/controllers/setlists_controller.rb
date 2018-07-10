class SetlistsController < ApplicationController
  load_and_authorize_resource

  def index
    @setlists = @setlists.for(current_user)
  end
end
