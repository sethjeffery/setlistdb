class SongsController < ApplicationController
  load_and_authorize_resource find_by: :slug, only: %i[show index]

  def index
    redirect_to root_path
  end

  def new
    authorize! :create, Version
    @version = Version.new(version_params).decorate
  end

  def show
    if @song.first_version
      redirect_to song_version_path(@song, @song.first_version)
    else
      redirect_to new_song_version_path(@song)
    end
  end

  def create
    authorize! :create, Version
    @version = Version.new(version_params.merge(user: current_user)).decorate
    if @version.save
      redirect_to song_version_path(@version.song, @version), flash: { notice: 'Song saved!' }
    else
      render :new
    end
  end

  def import
    authorize! :create, Version
    import = params[:version][:import]
    @version = Importer.new(import).as_version.decorate
    render :new
  end

  protected

  def version_params
    params.require(:version).permit(
      :title,
      :artist_names,
      :lyricist_names,
      :composer_names,
      :content,
      :lyrics,
      :key,
      :year,
      :lang,
      :version_type
    ) if params[:version]
  end

end
