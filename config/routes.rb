Rails.application.routes.draw do
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks',
    sessions: 'users/sessions',
  }

  devise_scope :user do
    delete "/logout" => "users/sessions#destroy", as: :logout
  end

  root to: "home#index"

  resources :songs do
    post :import, on: :collection
    resources :versions, path: 'v'
  end

  resources :users

  get 'search', to: 'search#index'
  get 'terms', to: 'terms#index'
  get 'privacy', to: 'terms#privacy'
end
