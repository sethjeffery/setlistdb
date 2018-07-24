class VersionsController < ApplicationController
  load_and_authorize_resource :song, find_by: :slug
  load_and_authorize_resource :version, through: :song, find_by: :position
  before_action :decorate, except: %i[index]

  def show
    respond_to do |format|
      format.chopro {
        send_data ChordproExporter.new(@version).to_s, filename: "#{@version.song.slug}.chopro"
      }
      format.onsong {
        send_data OnsongExporter.new(@version).to_s, filename: "#{@version.song.slug}.onsong"
      }
      format.html
    end
  end

  def new
    first_version = @version.song.first_version
    @version.title = first_version.title
    @version.artist_names = first_version.artist_names
    @version.key = first_version.key
  end

  def create
    @version.song = @song
    @version.user = current_user
    if @version.save
      redirect_to song_version_path(@song, @version), flash: { notice: 'Song saved!' }
    else
      render :new
    end
  end

  def update
    if @version.update_attributes(version_params)
      redirect_to [@version.song, @version], flash: { notice: 'Song saved!' }
    else
      render :edit
    end
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
    )
  end

  def decorate
    @version = @version.decorate
  end
end
