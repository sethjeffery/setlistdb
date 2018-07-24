class RemoveAuthorFromVersions < ActiveRecord::Migration[5.2]
  def change
    remove_reference :versions, :author, foreign_key: true
    remove_reference :songs, :author, foreign_key: true
  end
end
