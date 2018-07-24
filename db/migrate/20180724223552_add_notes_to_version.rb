class AddNotesToVersion < ActiveRecord::Migration[5.2]
  def change
    add_column :versions, :notes, :text
  end
end
