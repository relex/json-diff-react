{ pkgs ? import (import nix/nixpkgs.pin.nix) {}
}:

pkgs.mkShell {
  nativeBuildInputs = [
    pkgs.nodePackages.create-react-app
    pkgs.nodejs
  ];
}
