#!/usr/bin/env python3
"""
Quick setup script for Learning App.
Creates .env file and checks dependencies.
"""

import os
import sys
import subprocess
import shutil


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60 + "\n")


def check_command(command):
    """Check if a command is available"""
    return shutil.which(command) is not None


def create_env_file():
    """Create .env file from example if it doesn't exist"""
    if os.path.exists('.env'):
        print("✅ .env file already exists")
        return True

    if not os.path.exists('.env.example'):
        print("❌ Error: .env.example not found")
        return False

    shutil.copy('.env.example', '.env')
    print("✅ Created .env file from .env.example")
    print("\n⚠️  IMPORTANT: Add your Anthropic API key to .env file:")
    print("   ANTHROPIC_API_KEY=sk-ant-your-key-here")
    return True


def check_python():
    """Check Python version"""
    print("Checking Python...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python 3.8+ required (found {version.major}.{version.minor})")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True


def check_node():
    """Check Node.js"""
    print("Checking Node.js...")
    if not check_command('node'):
        print("❌ Node.js not found - install from https://nodejs.org/")
        return False

    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        print(f"✅ Node.js {result.stdout.strip()}")
        return True
    except:
        print("❌ Error checking Node.js version")
        return False


def setup_backend():
    """Set up backend dependencies"""
    print("Setting up backend...")

    # Create virtual environment
    venv_path = os.path.join('backend', 'venv')
    if not os.path.exists(venv_path):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, '-m', 'venv', venv_path], check=True)
        print("✅ Virtual environment created")
    else:
        print("✅ Virtual environment already exists")

    # Install dependencies
    print("Installing backend dependencies...")
    pip_cmd = os.path.join(venv_path, 'bin', 'pip') if os.name != 'nt' else os.path.join(venv_path, 'Scripts', 'pip.exe')

    requirements = os.path.join('backend', 'requirements.txt')
    subprocess.run([pip_cmd, 'install', '-r', requirements], check=True)
    print("✅ Backend dependencies installed")


def setup_frontend():
    """Set up frontend dependencies"""
    print("Setting up frontend...")

    os.chdir('frontend')
    subprocess.run(['npm', 'install'], check=True)
    os.chdir('..')

    print("✅ Frontend dependencies installed")


def main():
    """Main setup process"""
    print_header("Learning App - Setup")

    # Check prerequisites
    print_header("Checking Prerequisites")

    checks = [
        check_python(),
        check_node()
    ]

    if not all(checks):
        print("\n❌ Prerequisites not met. Please install missing dependencies.")
        sys.exit(1)

    # Create .env file
    print_header("Environment Configuration")
    if not create_env_file():
        sys.exit(1)

    # Install dependencies
    print_header("Installing Dependencies")

    try:
        setup_backend()
        setup_frontend()
    except Exception as e:
        print(f"\n❌ Error during installation: {e}")
        sys.exit(1)

    # Success message
    print_header("Setup Complete!")
    print("Next steps:")
    print("1. Add your Anthropic API key to .env file")
    print("2. Start the app:")
    print("   • Mac/Linux: make run")
    print("   • Windows:   start.bat")
    print("\nOr use these commands:")
    print("   • Backend only:  make backend")
    print("   • Frontend only: make frontend")
    print("\n🎉 Happy learning!")


if __name__ == '__main__':
    main()
