class SetlistsController < ApplicationController
  load_and_authorize_resource
  before_action :fetch_version, only: %i[show]
  before_action :decorate!, only: %i[show update edit]

  def index
    @setlists = @setlists.for(current_user).decorate
  end

  def show
  end

  def new
    @setlist.date = Date.current
    @setlist.song = params[:song] || params[:s]
    @setlist.version = params[:version] || params[:v]
  end

  def create
    @setlist.user = current_user
    if @setlist.save
      redirect_to @setlist, flash: { notice: 'New setlist created' }
    else
      render :new
    end
  end

  def update
    if @setlist.update(setlist_params)
      redirect_to @setlist, flash: { notice: 'Setlist updated' }
    else
      render :edit
    end
  end

  def add
    @setlist = Setlist.find(params[:id])
    authorize! :update, @setlist
    @setlist.add(params[:song_id], params[:version_id])
    redirect_to @setlist
  end

  private

  def setlist_params
    params.require(:setlist).permit(:title, :date, :song, :version)
  end

  def decorate!
    @setlist = @setlist&.decorate
    @version = @version&.decorate
  end

  def fetch_version
    if params[:song_id] && params[:version_id]
      @version = Version.find_by_slug_and_position(params[:song_id], params[:version_id])
    end
  end
end
