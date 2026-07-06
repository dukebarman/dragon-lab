document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  const graphMaps = Array.from(document.querySelectorAll("[data-cybergraph]"));
  const articleLayout = document.querySelector(".article-layout");
  const articleRail = document.querySelector("[data-article-rail]");
  const articleRailToggles = Array.from(document.querySelectorAll("[data-article-rail-toggle]"));
  const storageKey = "article-rail-expanded";

  const readStoredValue = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const writeStoredValue = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // The UI state is still updated even when browser storage is unavailable.
    }
  };

  if (toggle && panel) {
    const setNavExpanded = (expanded) => {
      toggle.setAttribute("aria-expanded", String(expanded));
      panel.classList.toggle("is-open", expanded);
    };

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      setNavExpanded(!expanded);
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavExpanded(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setNavExpanded(false);
      }
    });
  }

  if (articleLayout && articleRail && articleRailToggles.length > 0) {
    const setArticleRailExpanded = (expanded) => {
      articleLayout.classList.toggle("rail-hidden", !expanded);
      writeStoredValue(storageKey, expanded ? "true" : "false");

      articleRailToggles.forEach((button) => {
        const isShow = button.dataset.articleRailToggle === "show";
        button.setAttribute("aria-expanded", String(expanded));
        button.hidden = isShow ? expanded : !expanded;
      });
    };

    const storedRailState = readStoredValue(storageKey);
    const shouldStartCollapsed =
      window.matchMedia && window.matchMedia("(max-width: 1440px)").matches;
    setArticleRailExpanded(
      storedRailState ? storedRailState === "true" : !shouldStartCollapsed,
    );

    articleRailToggles.forEach((button) => {
      button.addEventListener("click", () => {
        setArticleRailExpanded(button.dataset.articleRailToggle === "show");
      });
    });
  }

  graphMaps.forEach((graphMap) => {
    const modeButtons = Array.from(graphMap.querySelectorAll("[data-cybergraph-switch]"));
    const panes = Array.from(graphMap.querySelectorAll("[data-cybergraph-pane]"));
    const copies = Array.from(graphMap.querySelectorAll("[data-cybergraph-copy]"));
    const tooltip = graphMap.querySelector("[data-cybergraph-tooltip]");
    const nodes = Array.from(graphMap.querySelectorAll(".cybergraph-link"));
    const edges = Array.from(graphMap.querySelectorAll(".cybergraph-edge"));
    let activeMode = graphMap.dataset.cybergraphMode || "tags";

    const getActivePane = () =>
      graphMap.querySelector(`[data-cybergraph-pane="${activeMode}"]`) || graphMap;

    const getActiveNodes = () => Array.from(getActivePane()?.querySelectorAll(".cybergraph-link") || []);

    const getActiveEdges = () => Array.from(getActivePane()?.querySelectorAll(".cybergraph-edge") || []);

    const clearGraphState = () => {
      graphMap.classList.remove("is-interacting");
      nodes.forEach((node) => node.classList.remove("is-dim", "is-highlight"));
      edges.forEach((edge) => edge.classList.remove("is-dim", "is-highlight"));

      if (tooltip) {
        tooltip.hidden = true;
      }
    };

    const placeTooltip = (clientX, clientY) => {
      if (!tooltip) {
        return;
      }

      const bounds = graphMap.getBoundingClientRect();
      tooltip.style.left = `${clientX - bounds.left + 14}px`;
      tooltip.style.top = `${clientY - bounds.top - 8}px`;
    };

    const activateNode = (node, clientX, clientY) => {
      const nodeId = node.dataset.nodeId;
      const activeNodes = getActiveNodes();
      const activeEdges = getActiveEdges();

      if (!nodeId || !activeNodes.includes(node)) {
        return;
      }

      graphMap.classList.add("is-interacting");
      activeNodes.forEach((item) => item.classList.add("is-dim"));
      activeEdges.forEach((edge) => edge.classList.add("is-dim"));

      node.classList.remove("is-dim");
      node.classList.add("is-highlight");

      activeEdges.forEach((edge) => {
        if (edge.dataset.edgeFrom === nodeId || edge.dataset.edgeTo === nodeId) {
          edge.classList.remove("is-dim");
          edge.classList.add("is-highlight");

          const linkedId =
            edge.dataset.edgeFrom === nodeId ? edge.dataset.edgeTo : edge.dataset.edgeFrom;

          activeNodes.forEach((item) => {
            if (item.dataset.nodeId === linkedId) {
              item.classList.remove("is-dim");
              item.classList.add("is-highlight");
            }
          });
        }
      });

      if (tooltip && node.dataset.tooltip) {
        tooltip.hidden = false;
        tooltip.textContent = node.dataset.tooltip;

        if (typeof clientX === "number" && typeof clientY === "number") {
          placeTooltip(clientX, clientY);
        } else {
          const box = node.getBoundingClientRect();
          placeTooltip(box.left + box.width / 2, box.top);
        }
      }
    };

    const setMode = (mode) => {
      activeMode = mode;
      graphMap.dataset.cybergraphMode = mode;
      clearGraphState();

      modeButtons.forEach((button) => {
        const isActive = button.dataset.cybergraphSwitch === mode;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      panes.forEach((pane) => {
        pane.hidden = pane.dataset.cybergraphPane !== mode;
      });

      copies.forEach((copy) => {
        copy.hidden = copy.dataset.cybergraphCopy !== mode;
      });
    };

    nodes.forEach((node) => {
      node.addEventListener("pointerenter", (event) => {
        activateNode(node, event.clientX, event.clientY);
      });

      node.addEventListener("pointermove", (event) => {
        if (tooltip && !tooltip.hidden) {
          placeTooltip(event.clientX, event.clientY);
        }
      });

      node.addEventListener("pointerleave", clearGraphState);
      node.addEventListener("focus", () => activateNode(node));
      node.addEventListener("blur", clearGraphState);
    });

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setMode(button.dataset.cybergraphSwitch || "tags");
      });
    });

    setMode(activeMode);
    graphMap.addEventListener("pointerleave", clearGraphState);
  });
});
