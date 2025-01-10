# Bibliography Builder

Bibliography Builder is a web application that allows users to generate formatted bibliographies from CSL-JSON files. Users can upload their citation data and choose from built-in citation styles or upload custom CSL style files.

![Application screenshot](https://github.com/user-attachments/assets/16cb0901-6465-4655-bfa8-6b7854983123)

## Table of Contents

- [Bibliography Builder](#bibliography-builder)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Usage](#usage)
  - [Development](#development)
    - [Linting](#linting)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Installation

### Prerequisites

- Node.js (see [.nvmrc](.nvmrc) for the specific version)
- npm

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/Addono/bibliography-builder.git
   cd bibliography-builder
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Development

<!-- ### Running Tests
- To run tests, use the following command:
  ```sh
  npm test
  ``` -->

### Linting

- To run the linter, use the following command:
  ```sh
  npm run lint
  ```

## License

This project is licensed under the MIT License.

## Acknowledgements

- Thanks to the developers of [Citation.js](https://citation.js.org/) for their excellent library.
- Special thanks to all contributors and users of this project.
