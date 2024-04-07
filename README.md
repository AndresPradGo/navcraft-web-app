[![NavCraft APP](/public/title.png)](https://navcraftapp.com)

_<center>_

### Crafting navigation flight plans has never been so simple

[Motivation](#motivation) • [Quick Start](#quick-start) • [Usage](#usage) • [Contributing](#contributing)

</center>

NavCraft APP is a web application for pilots to craft and showcase complete navigation VFR flight plans. It combines the functionality of [NavCraft API](https://github.com/AndresPradGo/navcraft-api) and [NavBrix API](https://github.com/AndresPradGo/navbrix-api) with a fast, simple and responsive user interface.

# <a id="motivation"></a> 🌟 Motivation

NavCraft APP was developed to achieve one goal:

> Help someone with minimum navigation knowledge plan a flight.

Together, NavCraft API and NavBrix API automate the work involved in producing:

- navigation logs,
- weight and balance graphs,
- fuel requirement calculations,
- weather and NOTAM briefings,
- takeoff and landing distance calculations.

However, the amount of data required can be overwhelming for someone who doesn't have the appropriate knowledge.

NavCraft APP organizes all this data in a fast, simple and responsive user interface that even your hundred-year-old grandmother can navigate.

# <a id="quick-start"></a> 🚀 Quick Start

The app is live. Go to [navcraftapp.com](https://navcraftapp.com) and start flight planning!

# <a id="usage"></a> 👨‍💻 Usage

Using the app is very simple!

1. First, you can either Register with your email or create a trial account.

2. Next, navigate to the `Aircraft` section, and add a new aircraft.

   - Open the sidebar and click on `Add Aircraft`, complete the form and save it. Once the new aircraft appears on your list of aircraft, click on `Details` to open it.

   - Click on `Add Performance Profile` and complete the form by selecting a profile from the list and saving it. Alternatively, you can create a blank profile and complete it yourself, but that requires more work. Currently, the app has Model Profiles for Cessnas 152 and Cessnas 172, which are the most common training aircraft around the world.

   - Once the new profile appears in your list, you can open it and edit it or you can leave it as it is. Please note that the profile must be marked as `Selected` if you want to use the aircraft on a flight.

   - You can edit any of the sections of the performance profile using the sidebar or tables' buttons.

3. Finally, navigate to the `Flights` section, click on `Add new flight`, complete the form and save it.

4. After completing these 3 steps you have successfully created your first flight, now you can open it and start adjusting your flight plan.

   - You can open the map and add new legs to your flight.
   - You can go to the `Flight Summary` section and edit any of the flight legs.
   - You can go to the `Weight & Balance` section and add passengers, baggage and fuel.
   - You can generate weather and NOTAMs Briefings.
   - And much more...

> [!TIP]
>
> - NavCraft APP is responsive, so you can use it on any device with a screen wider than just 375px.
> - Google Chrome is recommended, but the app supports other browsers like Mozilla Firefox and Safari.

# <a id="contributing"></a> 🤝 Contributing

Currently looking for help to work on the following features/issues, in order of urgency:

### 1. Issues 🐞

If you find a bug or a feature you want to implement, please raise an issue and submit a pull request. Your contributions are greatly appreciated.

### 2. Reusable Form Component <img align="center" alt="React" width="30px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" style="max-width: 100%; margin: 0; padding: 0;"/>

To organize large amounts of complex data, NavCraft APP relies on React styled-components like tables, modals, forms and sidebars. These components are being reused across most pages of the app.

Currently, the forms are all unique components, which leads to some code duplication. I am looking to refactor the code, following best practices to replace all forms with a reusable React component.

### 3. Testing <img align="center" alt="pytest" width="30px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitest/vitest-original.svg" style="max-width: 100%; margin: 0; padding: 0;"/>

The first version of the NavCraft APP has tests in place for common reusable components. To minimize vulnerabilities, the app uses Typescript for type checking, and the Node.js library Zod for validating user inputs.

We are currently looking to Test the rendering, behavior and submission of forms.

### 4. VFR Charts 🗺

NavCraft APP uses [React Leaflet](https://react-leaflet.js.org/) to render a map that allows the user to display and edit the flight path. The map currently displays aerodromes, waypoints and legs of the flight. To help the users plan their flights better, I want the map to show airspaces as well.

The long-term plan is to get airspace data from the NavCraft API, to display the airspace geometry using coordinates. However, NavCraft API
currently doesn't provide airspace coordinates. So, in the meantime, I want to place [_VFR Navigation Chart (VNC)_](https://products.navcanada.ca/shop-vfr/VFR-Navigation-Charts-VNC/) on top of the map as `.svg`, giving the user the option to display the VNC charts or the conventional map.

The API doesn't store these charts, so they'll need to be optimized and stored locally in a public directory. Also, VNC Charts are being updated about twice a year, so it would be great to give admin users the ability to update the charts from the application itself.

Please note that the VNC Charts need to be placed on the right coordinates. Thus, to work on this feature you need to have a good understanding of the React Leaflet library, geographical coordinates and navigation.

## 🛠 How to contribute

If you would like to work on any of the contributions mentioned above, follow the steps below.

> [!IMPORTANT]
> To run the code locally in development mode, you'll need to have [<img src="https://camo.githubusercontent.com/54c64e3f853121efbd21369ff4f07451209d3fbd4b18676ca4e0c6517f213476/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d446f636b65722d626c61636b3f7374796c653d666f722d7468652d6261646765266c6f676f436f6c6f723d7768697465266c6f676f3d646f636b657226636f6c6f723d303034454132" alt="Docker" data-canonical-src="https://img.shields.io/badge/-Docker-black?style=for-the-badge&amp;logoColor=white&amp;logo=docker&amp;color=004EA2" align="center" style="max-width: 100%; margin: 0 5px 0;">](https://docs.docker.com/get-docker/) installed on your machine.

### 0. Read the Open Source Guide 📑

This is an optional step, but a helpful one. If in doubt, follow the guidelines in the [Open Source Guide](https://opensource.guide/how-to-contribute/).

### 1. Browse the open issues 🔎

Check if someone else is already working on a similar feature. If there is an open issue you want to work on, and it hasn't been claimed, tag me in a comment to let me know you want to claim it.

If there is not an open issue related to the feature you want to work on, open a new one. Leave a detailed description of what you want to implement, and tag me on it. Add descriptive labels if appropriate.

### 2. Fork the repo 🔱

Once the issue has been assigned to you, set up the repository on your local machine.

- Fork the repository into your GitHub account.

- Clone the repo in your local machine.

  ```bash
  git clone https://github.com/<your_github_username>/navcraft-web-app.git
  ```

- Start a feature branch.

  ```bash
  cd navcraft-web-app
  git switch -c <feature_or_bugfix>/<feature_name>
  ```

### 3. Run the Docker container <img align="center" alt="Docker" width="40px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" style="max-width: 100%; margin: 0; padding: 0 0 5px;"/>

Once you've created a new feature branch, you can start working on the code. The repository has a `Dockerfile.dev` and `docker-compose.dev.yml` file to run in development mode:

- First, you can adjust the default environment variables of the project in the `docker-compose.dev.yml` file.
  The app only has two adjustable environment variables, which are related to the [Sentry.io](https://sentry.io/welcome/) project, so you can just leave them blank.

  | ENV_VARIABLE                | COMMENT                                           |
  | --------------------------- | ------------------------------------------------- |
  | `SENTRY_AUTH_TOKEN`         | Auth token used for the Sentry.io setup.          |
  | `VITE_REACT_APP_SENTRY_DSN` | DSN used to track the project's issues on Sentry. |

- Next, build the docker images and run the docker container:

  ```bash
  docker-compose -f docker-compose.dev.yml build
  docker-compose -f docker-compose.dev.yml up -d
  ```

- Finally, troubleshoot. If the docker container doesn't run properly on the first try, it's most likely because the port is occupied.

  - The container's port is mapped by default to the machine's port `5173`. If this port is occupied, open the `docker-compose.dev.yml` file and adjust the mapped port. The default ports are.

- The app will run on the localhost `127.0.0.1` and the mapped port. If you don't adjust the port, that would be:

  ```
  http://127.0.0.1:5173
  ```

> [!TIP]
> The `/src` directory in the host, is being mapped to the `/src` directory in the container. Thus, any changes you save will be automatically shared to the container. However, the `package.json` and `package-lock.json` files are not being mapped. If you install a new library, you'll need to rebuild the image for it to show in the container.

### 4. Submit a pull request <img align="center" alt="GitHub" width="36px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" style="max-width: 100%; margin: 0; padding: 0 0 1px; background: #FFF;border-radius: 50px"/>

After committing your code following commit best practices, you're ready to submit your changes.

- First, push the changes to your forked repo.

  ```bash
  git push origin <feature_or_bugfix>/<feature_name>
  ```

- Then, open a pull request to the `main` branch.
