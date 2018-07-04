class SearchController < ApplicationController
  def index
    @versions = Version.search_for(params[:q])
  end
end
