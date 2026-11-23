<script lang="ts">
  import type { wType } from "../types/wType";
  import { fileSystem, type FileSystem } from "../utils/fileSystem";
  import {
    closeWindow,
    toggleMinimize,
    toggleMaximize,
  } from "../stores/windowStore";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { syncProjectsToFileSystem } from "../utils/syncProjects";
  import { site } from "$lib/config";
  import { experience } from "$lib/experience";
  const prompt = `${site.username}@macbook`;

  $: currentDirectoryPath = `~/${currentDirectory.join("/")}`;

  export let startDrag: (
    e: MouseEvent,
    id: string,
    action: "move" | "resize"
  ) => void;
  export let window: wType;

  let terminalLines: string[] = [];
  let currentInput = "";
  let terminalRef: HTMLDivElement;
  let showPrompt = false;
  let commandHistory: string[] = [];
  let historyIndex = -1;
  let currentDirectory: string[] = ["home"];

  function addLine(text: string) {
    terminalLines = [...terminalLines, text];
    scrollToBottom();
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (terminalRef) {
        terminalRef.scrollTop = terminalRef.scrollHeight;
      }
    }, 0);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        currentInput = commandHistory[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > -1) {
        historyIndex--;
        currentInput = historyIndex === -1 ? "" : commandHistory[historyIndex];
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
    }
  }

  function processCommand(cmd: string) {
    addLine(
      `<span class="text-green-400">${prompt}</span><span class="text-white">:</span><span class="text-blue-400">~/${currentDirectory.join("/")}</span><span class="text-white">$</span> ${cmd}`
    );

    commandHistory = [cmd, ...commandHistory];
    historyIndex = -1;

    const [command, ...args] = cmd.split(" ");

    switch (command.toLowerCase()) {
      case "help":
        addLine("Available commands:");
        addLine("ls       - List directory contents");
        addLine("cd       - Change directory (e.g. cd projects)");
        addLine(`cat      - Display file contents (e.g. cat about${experience.length ? ", cat experience" : ""}, cat education, cat projects/minerai)`);
        addLine("pwd      - Print working directory");
        addLine("clear    - Clear the terminal");
        addLine("date     - Display current date and time");
        addLine("echo     - Print a message");
        break;
      case "ls": {
        const currentDir = args[0] ? resolvePath(args[0]).node : getCurrentDir();
        if (currentDir === undefined) {
          addLine(`ls: ${args[0]}: No such file or directory`);
        } else if (typeof currentDir === "object") {
          const items = Object.keys(currentDir);
          const itemsPerLine = 4;
          for (let i = 0; i < items.length; i += itemsPerLine) {
            const lineItems = items.slice(i, i + itemsPerLine).map((item) => {
              const isDirectory = typeof currentDir[item] === "object";
              const color = isDirectory ? "text-blue-400" : "text-white";
              return `<span class="${color}">${item}</span>`;
            });
            addLine(lineItems.join("\t"));
          }
        } else {
          addLine(args[0]);
        }
        break;
      }
      case "cd": {
        if (!args[0]) {
          currentDirectory = ["home"];
          break;
        }
        const target = resolvePath(args[0]);
        if (typeof target.node === "object" && target.parts.length > 0) {
          currentDirectory = target.parts;
        } else if (target.node === undefined) {
          addLine(`cd: ${args[0]}: No such file or directory`);
        } else {
          addLine(`cd: ${args[0]}: Not a directory`);
        }
        break;
      }
      case "cat": {
        if (!args[0]) {
          addLine("Usage: cat <filename>");
          break;
        }
        const target = resolvePath(args[0]);
        if (typeof target.node === "string") {
          addLine(makeUrlsClickable(target.node));
        } else if (target.node === undefined) {
          addLine(`cat: ${args[0]}: No such file or directory`);
        } else {
          addLine(`cat: ${args[0]}: Is a directory`);
        }
        break;
      }
      case "pwd":
        addLine(`/${currentDirectory.join("/")}`);
        break;
      case "clear":
        terminalLines = [];
        break;
      case "date":
        addLine(new Date().toLocaleString());
        break;
      case "echo":
        addLine(args.join(" "));
        break;
      case "exit":
        closeWindow(window.id);
        break;
      default:
        addLine(
          `Command not found: ${command}. Type "help" for available commands.`
        );
    }
  }

  // Resolve a path like "projects/minerai", "../about", "~/projects" or "/home"
  function resolvePath(path: string): { parts: string[]; node: FileSystem | string | undefined } {
    let parts = path.startsWith("/") ? [] : path.startsWith("~") ? ["home"] : [...currentDirectory];
    for (const seg of path.replace(/^~\/?/, "").split("/")) {
      if (!seg || seg === ".") continue;
      if (seg === "..") { if (parts.length > 1) parts = parts.slice(0, -1); continue; }
      parts = [...parts, seg];
    }
    let node: FileSystem | string | undefined = fileSystem;
    for (const seg of parts) {
      node = typeof node === "object" && seg in node ? node[seg] : undefined;
    }
    return { parts, node };
  }

  function getCurrentDir(): FileSystem | string {
    return currentDirectory.reduce((acc: FileSystem, curr: string) => {
      if (typeof acc === "object" && curr in acc) {
        return acc[curr];
      }
      return acc;
    }, fileSystem);
  }

  onMount(() => {
    syncProjectsToFileSystem(fileSystem);
    showPrompt = true;
    addLine(`Welcome to ${site.firstName}'s Terminal`);
    addLine('Type "help" to see available commands');
    addLine('Try "ls" to see available files and directories');
  });

  function handleTabCompletion() {
    const parts = currentInput.split(" ");
    if (parts.length < 2 || !["cd", "cat", "ls"].includes(parts[0])) return;
    const last = parts[parts.length - 1];
    const slash = last.lastIndexOf("/");
    const dirPath = slash >= 0 ? last.slice(0, slash + 1) : "";
    const prefix = last.slice(slash + 1);
    const dir = dirPath ? resolvePath(dirPath).node : getCurrentDir();
    if (typeof dir !== "object") return;
    const matches = Object.keys(dir).filter(
      (item) => item.startsWith(prefix) && (parts[0] !== "cd" || typeof dir[item] === "object")
    );
    if (matches.length === 1) {
      const isDir = typeof dir[matches[0]] === "object";
      parts[parts.length - 1] = dirPath + matches[0] + (isDir ? "/" : "");
      currentInput = parts.join(" ");
    } else if (matches.length > 1) {
      addLine(matches.join("  "));
    }
  }

  function makeUrlsClickable(text: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" class="text-blue-400 hover:underline">${url}</a>`);
  }
</script>

<div class="bg-gray-900/40 backdrop-blur-md h-full border border-white/20">
  <!-- Terminal Header -->
  <div
    class="bg-gray-800/80 px-4 py-2 flex items-center cursor-move"
    on:mousedown={(e) => startDrag(e, window.id, "move")}
  >
    <div class="flex space-x-2">
      <div
        class="w-3 h-3 rounded-full bg-red-500 cursor-pointer"
        on:click={() => closeWindow(window.id)}
      ></div>
      <div
        class="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"
        on:click={() => toggleMinimize(window.id)}
      ></div>
      <div
        class="w-3 h-3 rounded-full bg-green-500 cursor-pointer"
        on:click={() => toggleMaximize(window.id)}
      ></div>
    </div>
    <div class="flex-grow text-center text-sm text-gray-400">
      {prompt}: ~/{currentDirectory.join("/")}
    </div>
  </div>

  <!-- Terminal Body -->
  <div
    bind:this={terminalRef}
    class="bg-black/30 p-4 overflow-y-auto"
    style="height: calc(100% - 80px);"
  >
    {#each terminalLines as line}
      <br />
      <span
        class="text-gray-200 whitespace-pre"
        transition:fade|local={{ duration: 150 }}
      >
        {@html line}
      </span>
    {/each}
  </div>

  <!-- Terminal Input -->
  {#if showPrompt}
    <div class="bg-black/30 px-4 py-2 flex items-center">
      <span class="text-green-400 mr-1">{prompt}</span>
      <span class="text-white mr-1">:</span>
      <span class="text-blue-400 mr-1">~/{currentDirectory.join("/")}</span>
      <span class="text-white mr-2">$</span>
      <input
        type="text"
        bind:value={currentInput}
        on:keydown={(e) => {
          if (e.key === "Enter" && currentInput.trim()) {
            processCommand(currentInput.trim());
            currentInput = "";
          } else {
            handleKeydown(e);
          }
        }}
        class="bg-transparent border-none outline-none flex-grow text-gray-200 w-full"
        autocomplete="off"
        autofocus
      />
    </div>
  {/if}
</div>
