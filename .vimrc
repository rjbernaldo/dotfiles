execute pathogen#infect()
syntax on
colorscheme monokai
filetype plugin indent on
" inoremap { {<CR>}<up><end><CR>

set noswapfile
set tabstop=2
set shiftwidth=2
set expandtab
set mouse=a
set number
set guioptions=

let g:NERDTreeWinSize = 25
let g:tmux_navigator_no_mappings = 1
let g:tmuxline_preset = 'nightly_fox'
let g:tmuxline_powerline_separators = 0
let g:airline#extensions#tmuxline#enabled = 1
let airline#extensions#tmuxline#snapshot_file = "~/.tmux-status.conf"
let g:ag_working_path_mode = "r"
let g:session_autosave = 'no'
let g:jsx_ext_required = 0

let g:ctrlp_custom_ignore = {
  \ 'dir':  '\v[\/]\.(git|hg|svn|node_modules)$',
  \ 'file': '\v\.(exe|so|dll)$',
  \ }

" key remaps
nnoremap <silent> <C-h> :TmuxNavigateLeft<cr>
nnoremap <silent> <C-j> :TmuxNavigateDown<cr>
nnoremap <silent> <C-k> :TmuxNavigateUp<cr>
nnoremap <silent> <C-l> :TmuxNavigateRight<cr>
nnoremap <silent> <C-\> :NERDTreeTabsToggle<cr>
nnoremap <silent> <C-W>h 10<C-W><
nnoremap <silent> <C-W>j 10<C-W>-
nnoremap <silent> <C-W>k 10<C-W>+
nnoremap <silent> <C-W>l 10<C-W>>
nnoremap <silent> <C-W>% 10<C-W>v
nnoremap <silent> <C-W>" 10<C-W>s
nnoremap <silent> <C-W>c :tabnew<cr>
nnoremap <silent> <C-W>1 1gt
nnoremap <silent> <C-W>2 2gt
nnoremap <silent> <C-W>3 3gt
nnoremap <silent> <C-W>4 4gt
nnoremap <silent> <C-W>5 5gt
nnoremap <silent> <C-W>w :q<cr>

" syntastic
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

" let g:syntastic_always_populate_loc_list = 1
" let g:syntastic_auto_loc_list = 1
" let g:syntastic_loc_list_height = 1
" let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
let g:syntastic_javascript_checkers = ['eslint']
