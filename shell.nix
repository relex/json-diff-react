{ pkgs ? import (import nix/nixpkgs.pin.nix) {}
}:

pkgs.mkShell {
  nativeBuildInputs = [
    pkgs.nodejs
  ];
}
