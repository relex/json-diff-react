{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = [ 
      pkgs.nodePackages.create-react-app
      pkgs.yarn
    ];
}
