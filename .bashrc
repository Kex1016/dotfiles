# ~/.bashrc: executed by bash(1) for non-login shells.

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# Improved history settings
export HISTCONTROL=ignorespace:ignoredups:erasedups
export HISTSIZE=1000
export HISTFILESIZE=2000
shopt -s histappend

# Enhanced history cleanup function
cleanup-history() {
    local histfile="$HOME/.bash_history"
    [[ -r "$histfile" ]] || return
    tac "$histfile" | awk '!seen[$0]++' | tac | \
        sed -e 's/[[:space:]]*$//' -e '/^$/d' > "${histfile}.tmp"
    [[ -s "${histfile}.tmp" ]] && mv -f "${histfile}.tmp" "$histfile"
    history -c
    history -r
}

# Set a unique title for each terminal
# get all foot processes
terminals=$(ps -eo pid,cmd | grep -E 'foot|alacritty' | grep -v grep | awk '{print $1}')
# set current id to the number of terminals
current_id=$(echo "$terminals" | wc -l)
# set the title of the terminal to the current id
# case "$TERM" in
#     xterm*|rxvt*|foot*|alacritty*)
#         title_command='echo -ne "\033]0;[$current_id] ${USER}@${HOSTNAME%%.*}:${PWD/#$HOME/~}\007"'
#         ;;
# esac

export PROMPT_COMMAND="history -a; cleanup-history; history -n"

# Enable programmable completion
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

shopt -s checkwinsize

# Color prompt setup
if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
    PS1='[\[\e[32m\]\A\[\e[0m\]][\[\e[34m\]\h\[\e[0m\]][\[\e[33m\]\w\[\e[0m\]]\$ '
else
    PS1='[\A][\h][\w]\$ '
fi

case "$TERM" in
    xterm*|rxvt*|foot*|alacritty*)
        PS1="\[\e]0;[$current_id] \u@\h: \w\a\]$PS1"
        ;;
esac

# Load aliases
[[ -f ~/.config/aliasrc ]] && . ~/.config/aliasrc

# Proper FZF integration
if [[ -f /usr/share/doc/fzf/examples/key-bindings.bash ]]; then
    source /usr/share/doc/fzf/examples/key-bindings.bash
elif [[ -f ~/.fzf.bash ]]; then
    source ~/.fzf.bash
elif [[ -f /usr/share/fzf/key-bindings.bash ]]; then
    source /usr/share/fzf/key-bindings.bash
fi

# Enhanced history search (CTRL-R)
__fzf_history__() {
    local output
    output=$(
        HISTTIMEFORMAT= history |
        fzf --height 100% --tac --tiebreak=index --no-sort --exact \
            --bind 'ctrl-d:page-down,ctrl-u:page-up'
    )
    [[ -n "$output" ]] && printf "%s" "$output" | sed 's/^ *[0-9]* *//'
}

# Improved key binding for history search
if [[ $- == *i* ]]; then
    bind '"\C-r": " \C-e\C-u\C-y\ey\C-u$(__fzf_history__)\e\C-e\er\e^"'
fi

# Ensure CTRL-T works with proper preview
if command -v bat &>/dev/null; then
    export FZF_CTRL_T_OPTS="--preview 'bat --color=always --line-range :500 {}'"
elif command -v highlight &>/dev/null; then
    export FZF_CTRL_T_OPTS="--preview 'highlight -O ansi --line-numbers {}'"
else
    export FZF_CTRL_T_OPTS="--preview 'cat {}'"
fi

function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
		builtin cd -- "$cwd"
	fi
	rm -f -- "$tmp"
}

# NPM packages in homedir
export NPM_PACKAGES="$HOME/.npm-packages"

# Tell our environment about user-installed node tools
PATH="$NPM_PACKAGES/bin:$HOME/.local/share/cargo/bin/:$PATH"
# Unset manpath so we can inherit from /etc/manpath via the `manpath` command
unset MANPATH  # delete if you already modified MANPATH elsewhere in your configuration
MANPATH="$NPM_PACKAGES/share/man:$(manpath)"

# Tell Node about these packages
NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"

# Don't log a command in history
nhist() {
    HISTFILE=/dev/null
    bash -ic "$*"
    history -d $(history 1)
}

eval "$(zoxide init bash)"

fastfetch -c examples/8
