class AddAuthorNameToVersions < ActiveRecord::Migration[5.2]
  def change
    add_column :versions, :author_name, :string
  end
end
