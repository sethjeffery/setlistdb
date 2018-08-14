class SetlistVersionsController < ApplicationController
  load_and_authorize_resource :setlist
  load_and_authorize_resource :setlist_version, through: :setlist
  before_action :decorate

  def update
    if @setlist_version.update_attributes(setlist_version_params)
      redirect_to @setlist, flash: { notice: 'Setlist song updated!' }
    else
      render :edit
    end
  end

  def destroy
    @setlist_version.destroy
    redirect_to setlist_path(@setlist)
  end

  protected

  def setlist_version_params
    params.require(:setlist_version).permit(
      :content,
      :key,
      :transpose,
      :notes
    )
  end

  def decorate
    @setlist_version = @setlist_version&.decorate
    @setlist = @setlist&.decorate
  end
end
