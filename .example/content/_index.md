---
title: "Hugo Gallery"
description: "A uniquely styled Hugo photo gallery theme."
keywords: ["Hugo", "Gallery"]

cascade:
  build:
    publishResources: false # Do not include full images.

menus:
  main: # Display home sub-item in the [main] menu.
    name: "Home"
    weight: -9

resources:
  - src: "graph.jpeg"
    params:
      cover: true # Cover of the home page is used for OpenGraph.
---
