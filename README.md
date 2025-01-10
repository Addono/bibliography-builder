# Bibliography Builder

## Description
Bibliography Builder is a web application that allows users to generate formatted bibliographies from CSL-JSON files. Users can upload their citation data and choose from built-in citation styles or upload custom CSL style files.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Installation
### Prerequisites
- Node.js (version X.X.X)
- npm (version X.X.X)

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

### Example
- Upload a CSL-JSON file containing your citations.
- Select a citation style or upload a custom CSL file.
- Copy the generated bibliography.

## Configuration
- **.nvmrc**: Node version configuration.
- **tsconfig.json**: TypeScript configuration.
- **eslint.config.mjs**: ESLint configuration.

## Development
### Running Tests
- To run tests, use the following command:
  ```sh
  npm test
  ```

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
