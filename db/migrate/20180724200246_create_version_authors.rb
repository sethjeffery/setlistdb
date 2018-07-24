class CreateVersionAuthors < ActiveRecord::Migration[5.2]
  def up
    create_table :version_authors do |t|
      t.references :version, foreign_key: true
      t.references :author, foreign_key: true
      t.integer :position, default: 1
      t.integer :authoring, default: 0

      t.timestamps
    end

    Version.where.not(author_id: nil).each do |version|
      version.version_authors.create!(author_id: version.author_id)
    end
  end

  def down
    VersionAuthor.all.each do |va|
      va.version.update author_id: va.author_id
    end

    drop_table :version_authors
  end
end
