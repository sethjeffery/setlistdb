class SongsController < ApplicationController
  load_and_authorize_resource find_by: :slug, only: %i[show index]

  def new
    @version = Version.new.decorate
  end

  def show
    if @song.first_version
      redirect_to song_version_path(@song, @song.first_version)
    else
      redirect_to new_song_version_path(@song)
    end
  end

  def create
    @version = Version.new(version_params.merge(user: current_user)).decorate
    if @version.save
      redirect_to song_version_path(@version.song, @version), flash: { notice: 'Song saved!' }
    else
      render :new
    end
  end

  protected

  def version_params
    params.require(:version).permit(
      :title,
      :author_name,
      :content,
      :lyrics,
      :key,
      :year,
      :lang,
      :version_type
    )
  end

end
