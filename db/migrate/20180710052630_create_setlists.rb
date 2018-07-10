class CreateSetlists < ActiveRecord::Migration[5.2]
  def change
    create_table :setlists do |t|
      t.references :user, foreign_key: true
      t.string :title
      t.date :date
      t.timestamps
    end

    add_index :setlists, [:user_id, :date]
  end
end
