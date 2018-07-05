Rails.application.routes.draw do
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  root to: "home#index"

  resources :songs do
    resources :versions, path: 'v'
  end

  resources :users

  get 'search', to: 'search#index'
  get 'terms', to: 'terms#index'
  get 'privacy', to: 'terms#privacy'
end
