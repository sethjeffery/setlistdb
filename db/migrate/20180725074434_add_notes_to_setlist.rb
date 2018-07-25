class AddNotesToSetlist < ActiveRecord::Migration[5.2]
  def change
    add_column :setlists, :notes, :text
  end
end
