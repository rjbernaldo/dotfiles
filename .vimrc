execute pathogen#infect()

syntax enable
filetype plugin indent on

set t_Co=256
if (has("termguicolors"))
  set termguicolors
endif

set guifont="Fira Code iScript"

let g:oceanic_next_terminal_bold = 1
let g:oceanic_next_terminal_italic = 1

colorscheme OceanicNext

" hide trailing tilde
highlight EndOfBuffer ctermfg=235 ctermbg=235

let g:airline_theme='oceanicnext'

set noswapfile
set tabstop=2
set shiftwidth=2
set expandtab
set mouse=a
set number

let g:tmux_navigator_no_mappings = 1
let g:tmuxline_preset = 'nightly_fox'
let g:tmuxline_powerline_separators = 0
let g:airline#extensions#tmuxline#enabled = 1
let airline#extensions#tmuxline#snapshot_file = "~/.tmux-status.conf"
let g:session_autosave = 'no'

let g:ale_completion_enabled = 1
"let g:ale_fixers = {
"      \  'javascript': ['eslint'],
"      \}
"let g:ale_fix_on_save = 1

let g:javascript_plugin_jsdoc = 1

" NERDTREE
let g:NERDTreeWinSize = 25
let NERDTreeMinimalUI = 1
let NERDTreeDirArrows=0
"let g:nerdtree_tabs_open_on_console_startup=1
let g:nerdtree_tabs_focus_on_files=1
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * NERDTree
autocmd VimEnter * wincmd w
autocmd BufWinEnter * NERDTreeMirror
" Check if NERDTree is open or active
function! IsNERDTreeOpen()        
  return exists("t:NERDTreeBufName") && (bufwinnr(t:NERDTreeBufName) != -1)
endfunction
autocmd WinEnter * call s:CloseIfOnlyNerdTreeLeft()
" Close all open buffers on entering a window if the only
" buffer that's left is the NERDTree buffer
function! s:CloseIfOnlyNerdTreeLeft()
  if exists("t:NERDTreeBufName")
    if bufwinnr(t:NERDTreeBufName) != -1
      if winnr("$") == 1
        q
      endif
    endif
  endif
endfunction

" Call NERDTreeFind iff NERDTree is active, current window contains a modifiable
" file, and we're not in vimdiff
function! SyncTree()
  if &modifiable && IsNERDTreeOpen() && strlen(expand('%')) > 0 && !&diff
    NERDTreeFind
    wincmd p
  endif
endfunction

" Highlight currently open buffer in NERDTree
autocmd BufEnter * call SyncTree()
nnoremap <silent> <C-e> :NERDTreeToggle<cr>

" WHEN STARTING ON EMPTY DIRECTORY
if bufname('%') == ''
  set bufhidden=wipe
endif

" fzf + ripgrep
" http://owen.cymru/fzf-ripgrep-navigate-with-bash-faster-than-ever-before/
set rtp+=/usr/local/opt/fzf
let g:rg_command = '
  \ rg --column --line-number --no-heading --fixed-strings --ignore-case --no-ignore --hidden --follow --color "always"
  \ -g "*.{js,json,php,md,styl,jade,html,config,py,cpp,c,go,hs,rb,conf}"
  \ -g "!package-lock.json"
  \ -g "!{.git,node_modules,vendor}/*" '
command! -bang -nargs=* F call fzf#vim#grep(g:rg_command .shellescape(<q-args>), 1, <bang>0)
nnoremap <silent> <C-F> :F<Cr>
nnoremap <silent> <C-p> :Files<Cr>
let g:fzf_action = {
  \ 'ctrl-t': 'tab split',
  \ 'ctrl-i': 'split',
  \ 'ctrl-s': 'vsplit' }

" tmux integration
nnoremap <silent> <C-h> :TmuxNavigateLeft<cr>
nnoremap <silent> <C-j> :TmuxNavigateDown<cr>
nnoremap <silent> <C-k> :TmuxNavigateUp<cr>
nnoremap <silent> <C-l> :TmuxNavigateRight<cr>
"nnoremap <silent> <C-e> :NERDTreeTabsToggle<cr>

