class HomeController < ApplicationController
  def index
    @songs = Song.all.order(:title)
    render 'songs/index'
  end
end
